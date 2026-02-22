import data.Database;
import gui.ControlPanel;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class Main {
    static void main() {
        try {
            Database database = Database.getInstance();
            Connection connection = database.getConnection();
            ControlPanel controlPanel = new ControlPanel();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
