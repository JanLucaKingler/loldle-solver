import data.Database;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class Main {
    static void main() {
        try {
            Database database = Database.getInstance();
            Connection connection = database.getConnection();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
