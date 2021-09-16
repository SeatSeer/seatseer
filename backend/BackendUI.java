import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.FileNotFoundException;
import java.io.IOException;

public class BackendUI extends Frame {
    BackendUI(String name) {
        Button quit = new Button("Stop");
        quit.setBounds(50,50,50,50);
        if (name.equals("Sensor Producer")) quit.addActionListener(new QuitSensorProducer());
        //if (name.equals("Notification Manager")) quit.addActionListener(new QuitNotifManager());
        add(quit);
        setSize(200,200);
        setTitle(name);
        setLayout(new FlowLayout());
        setVisible(true);
    }

    private static class QuitSensorProducer implements ActionListener {
        public void actionPerformed(ActionEvent action) {
            System.out.println("quitting sensor producer");
            try {
                SensorProducer.gracefulShutdown();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
            System.exit(130);
        }
    }
/*
    private static class QuitNotifManager implements ActionListener {
        public void actionPerformed(ActionEvent action) {
            System.out.println("quitting notification manager");
            try {
                NotificationManager.gracefulShutdown();
            } catch (IOException e) {
                e.printStackTrace();
            }
            System.exit(130);
        }
    }
 */

    private static class Other implements ActionListener {
        public void actionPerformed(ActionEvent action) {
            System.out.println("ending");
            System.exit(130);
        }
    }
}
