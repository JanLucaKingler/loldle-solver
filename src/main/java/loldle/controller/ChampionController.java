package loldle.controller;

import loldle.model.Champion;
import loldle.service.ChampionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ChampionController {

    private final ChampionService championService;

    public ChampionController(ChampionService championService) {
        this.championService = championService;
    }

    @GetMapping("/champions")
    public ResponseEntity<?> getAllChampions() {
        return ResponseEntity.ok(championService.getAllChampions());
    }

    @GetMapping("/champions/{name}")
    public ResponseEntity<?> getChampion(@PathVariable String name) {
        Champion champ = championService.getChampionByName(name);
        if (champ == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(champ);
    }
}