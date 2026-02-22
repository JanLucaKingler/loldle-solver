package gui;

import javax.swing.*;
import java.awt.*;

public class ControlPanel extends JPanel {

    private JTextField roleField;
    private JTextField regionField;
    private JTextField genderField;
    private JTextArea resultArea;

    public ControlPanel() {

        setLayout(new BorderLayout());

        JPanel inputPanel = new JPanel();
        inputPanel.setLayout(new GridLayout(4, 2, 5, 5));

        inputPanel.add(new JLabel("Role:"));
        roleField = new JTextField();
        inputPanel.add(roleField);

        inputPanel.add(new JLabel("Region:"));
        regionField = new JTextField();
        inputPanel.add(regionField);

        inputPanel.add(new JLabel("Gender:"));
        genderField = new JTextField();
        inputPanel.add(genderField);

        JButton solveButton = new JButton("Solve");
        inputPanel.add(solveButton);

        add(inputPanel, BorderLayout.NORTH);

        resultArea = new JTextArea(10, 30);
        resultArea.setEditable(false);
        add(new JScrollPane(resultArea), BorderLayout.CENTER);

        solveButton.addActionListener(e -> solve());
    }

    private void solve() {
        String role = roleField.getText();
        String region = regionField.getText();
        String gender = genderField.getText();
    }
}