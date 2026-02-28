package loldle.service;

import loldle.model.Champion;
import loldle.repository.ChampionDAO;
import org.springframework.stereotype.Service;

@Service
public class ChampionService {

    private final ChampionDAO championDAO;

    public ChampionService(ChampionDAO championDAO) {
        this.championDAO = championDAO;
    }

    public Champion getChampionByName(String name) {
        return championDAO.findByName(name);
    }

    public Champion getDailyChampion() {
        return championDAO.findAll().get(0);
    }
}