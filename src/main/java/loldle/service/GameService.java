package loldle.service;

import loldle.game.*;
import loldle.model.Champion;
import loldle.repository.ChampionDAO;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.*;

@Service
@Getter
@Setter
public class GameService {

    private final ChampionDAO championDAO;
    private final GameState state = new GameState();
    private List<Champion> allChampions;

    public GameService(ChampionDAO championDAO) {
        this.championDAO = championDAO;
        allChampions = championDAO.findAll();
    }

    public Champion loadChampion(String name) {
        if (state.getUsedChampNames().contains(name.toLowerCase())) {
            throw new IllegalArgumentException("Champion already used: " + name);
        }
        Champion champ = championDAO.findByName(name);
        if (champ == null) return null;

        state.reset();
        state.setCurrentChamp(champ);
        return champ;
    }

    public void setColor(String field, String color) {
        state.getSelectedColors().put(field, color);
    }

    public void setYearDirection(String direction) {
        if (direction.equals(state.getYearDirection())) {
            state.setYearDirection(null);
        } else {
            state.setYearDirection(direction);
        }
    }

    public GuessResult addGuess() {
        Champion champ = state.getCurrentChamp();
        if (champ == null) throw new IllegalStateException("No champion loaded");

        Map<String, String> values = new LinkedHashMap<>();
        Map<String, String> colors = new LinkedHashMap<>();
        Constraints con = state.getConstraints();

        for (String f : GameState.FIELDS) {
            String rawValue = getField(champ, f);
            String color = state.getSelectedColors().getOrDefault(f, "none");
            List<String> tokens = tokenize(rawValue);

            String displayVal = rawValue;
            if (f.equals("releaseYear") && state.getYearDirection() != null) {
                displayVal = rawValue + " " + ("higher".equals(state.getYearDirection()) ? "⬆" : "⬇");
            }
            values.put(f, displayVal);
            colors.put(f, color);

            if ("green".equals(color)) {
                con.getGreen().put(f, rawValue);
            } else if ("yellow".equals(color)) {
                con.getYellow().computeIfAbsent(f, k -> new ArrayList<>());
                for (String t : tokens) {
                    if (!con.getYellow().get(f).contains(t)) con.getYellow().get(f).add(t);
                }
            } else if ("red".equals(color)) {
                con.getRed().computeIfAbsent(f, k -> new ArrayList<>());
                for (String t : tokens) {
                    if (!con.getRed().get(f).contains(t)) con.getRed().get(f).add(t);
                }
            }

            if (f.equals("releaseYear") && state.getYearDirection() != null) {
                int year = Integer.parseInt(rawValue.trim());
                if ("higher".equals(state.getYearDirection())) {
                    con.setYearMin(con.getYearMin() == null ? year : Math.max(con.getYearMin(), year));
                } else {
                    con.setYearMax(con.getYearMax() == null ? year : Math.min(con.getYearMax(), year));
                }
            }
        }

        state.getUsedChampNames().add(champ.getName().toLowerCase());
        state.setCurrentChamp(null);

        return new GuessResult(champ.getName(), values, colors);
    }

    public List<Champion> getPossibleChampions() {
        return allChampions.stream()
                .filter(c -> !state.getUsedChampNames().contains(c.getName().toLowerCase()))
                .filter(this::matchesConstraints)
                .toList();
    }

    private boolean matchesConstraints(Champion champ) {
        Constraints con = state.getConstraints();

        for (String f : GameState.FIELDS) {
            String rawValue = getField(champ, f);
            List<String> tokens = tokenize(rawValue);

            if (con.getGreen().containsKey(f)) {
                if (!rawValue.equals(con.getGreen().get(f))) return false;
                continue;
            }
            List<String> yellows = con.getYellow().get(f);
            if (yellows != null && !yellows.isEmpty()) {
                boolean hasMatch = yellows.stream().anyMatch(tokens::contains);
                if (!hasMatch) return false;
            }
            List<String> reds = con.getRed().get(f);
            if (reds != null && !reds.isEmpty()) {
                boolean hasRed = reds.stream().anyMatch(tokens::contains);
                if (hasRed) return false;
            }
        }

        try {
            int year = Integer.parseInt(getField(champ, "releaseYear").trim());
            if (con.getYearMin() != null && year <= con.getYearMin()) return false;
            if (con.getYearMax() != null && year >= con.getYearMax()) return false;
        } catch (NumberFormatException ignored) {
        }

        return true;
    }

    private String getField(Champion champ, String fieldName) {
        try {
            Field f = Champion.class.getDeclaredField(fieldName);
            f.setAccessible(true);
            Object val = f.get(champ);
            return val == null ? "" : val.toString();
        } catch (Exception e) {
            return "";
        }
    }

    private List<String> tokenize(String raw) {
        if (raw == null || raw.isBlank()) return List.of();
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}