package loldle.controller;

import loldle.model.Champion;
import loldle.service.ChampionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ChampionController {

    private final ChampionService championService;

    public ChampionController(ChampionService championService) {
        this.championService = championService;
    }

    @GetMapping("/guess/{name}")
    public ResponseEntity<?> guess(@PathVariable String name) {

        Champion guess = championService.getChampionByName(name);
        Champion target = championService.getDailyChampion();

        if (guess == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> result = new HashMap<>();

        result.put("name", guess.getName());

        result.put("gender", guess.getGender());
        result.put("genderMatch",
                guess.getGender().equalsIgnoreCase(target.getGender()));

        result.put("position", guess.getPosition());
        result.put("positionMatch",
                guess.getPosition().equalsIgnoreCase(target.getPosition()));

        result.put("species", guess.getSpecies());
        result.put("speciesMatch",
                guess.getSpecies().equalsIgnoreCase(target.getSpecies()));

        result.put("resource", guess.getResource());
        result.put("resourceMatch",
                guess.getResource().equalsIgnoreCase(target.getResource()));

        result.put("rangeType", guess.getRangeType());
        result.put("rangeMatch",
                guess.getRangeType().equalsIgnoreCase(target.getRangeType()));

        result.put("region", guess.getRegion());
        result.put("regionMatch",
                guess.getRegion().equalsIgnoreCase(target.getRegion()));

        result.put("releaseYear", guess.getReleaseYear());
        result.put("yearMatch",
                guess.getReleaseYear() == target.getReleaseYear());

        return ResponseEntity.ok(result);
    }
}