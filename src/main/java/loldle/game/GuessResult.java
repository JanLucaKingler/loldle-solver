package loldle.game;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class GuessResult {
    private String name;
    private Map<String, String> values;
    private Map<String, String> colors;

    public GuessResult(String name, Map<String, String> values, Map<String, String> colors) {
        this.name = name;
        this.values = values;
        this.colors = colors;
    }
}