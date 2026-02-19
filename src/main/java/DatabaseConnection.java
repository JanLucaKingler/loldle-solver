import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

private static final String URL = "jdbc:sqlite:leagueoflegends";

public static Connection connect() {
    Connection conn = null;
    try {
        conn = DriverManager.getConnection(URL);
        IO.println("Verbindung zur Datenbank hergestellt!");
    } catch (SQLException e) {
        IO.println("Verbindungsfehler: " + e.getMessage());
    }
    return conn;
}

void main() {
    Connection connection = connect();
    if (connection != null) {
        try {
            connection.close();
            IO.println("Verbindung geschlossen.");
        } catch (SQLException e) {
            IO.println("Fehler beim Schließen: " + e.getMessage());
        }
    }
}
