package loldle.service;

import loldle.model.Champion;
import loldle.repository.ChampionDAO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChampionService {

    private final ChampionDAO championDAO;

    public ChampionService(ChampionDAO championDAO) {
        this.championDAO = championDAO;
    }

    public Champion getChampionByName(String name) {
        return championDAO.findByName(name);
    }

    public List<Champion> getAllChampions() {
        return championDAO.findAll();
    }
}