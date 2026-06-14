package com.example.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initFirebase() {
        try {
            // resources 폴더 안의 키 파일 읽어오기
            InputStream serviceAccount = getClass().getClassLoader()
                    .getResourceAsStream("firebase-service-account.json");

            if (serviceAccount == null) {
                throw new RuntimeException("파이어베이스 키 파일을 찾을 수 없습니다. src/main/resources/ 확인해보세요.");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            // FirebaseApp이 아직 초기화되지 않은 경우에만 초기화 진행
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("🔥 파이어베이스(Firestore) 연결에 성공했습니다!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ 파이어베이스 초기화 중 에러가 발생했습니다.");
        }
    }
}
