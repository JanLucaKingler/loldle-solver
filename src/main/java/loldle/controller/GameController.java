package loldle.controller;

import loldle.game.GuessResult;
import loldle.model.Champion;
import loldle.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/game")
@CrossOrigin
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/load/{name}")
    public ResponseEntity<?> loadChampion(@PathVariable String name) {
        Champion champ = gameService.loadChampion(name);
        if (champ == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(champ);
    }

    @PostMapping("/color")
    public ResponseEntity<?> setColor(@RequestBody Map<String, String> body) {
        gameService.setColor(body.get("field"), body.get("color"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/yeardir")
    public ResponseEntity<?> setYearDir(@RequestBody Map<String, String> body) {
        gameService.setYearDirection(body.get("direction"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/guess")
    public ResponseEntity<GuessResult> addGuess() {
        GuessResult result = gameService.addGuess();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/possible")
    public ResponseEntity<List<Champion>> getPossible() {
        return ResponseEntity.ok(gameService.getPossibleChampions());
    }
}