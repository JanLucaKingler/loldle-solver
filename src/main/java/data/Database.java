package data;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class Database {

    private static final String URL = "jdbc:sqlite:leagueoflegends.db";
    private static Database instance;
    private Connection conn;


    private Database() throws SQLException {
        try {
            conn = DriverManager.getConnection(URL);
            System.out.println("Verbindung zur Datenbank hergestellt!");
        } catch (SQLException e) {
            System.err.println("Verbindungsfehler: " + e.getMessage());
            throw e;
        }
    }

    public static synchronized Database getInstance() throws SQLException {
        if (instance == null) {
            instance = new Database();
        }
        return instance;
    }


    public Connection getConnection() {
        return conn;
    }


    public void closeConnection() {
        if (conn != null) {
            try {
                conn.close();
                System.out.println("Verbindung zur Datenbank geschlossen.");
            } catch (SQLException e) {
                System.err.println("Fehler beim Schließen: " + e.getMessage());
            }
        }
    }
}