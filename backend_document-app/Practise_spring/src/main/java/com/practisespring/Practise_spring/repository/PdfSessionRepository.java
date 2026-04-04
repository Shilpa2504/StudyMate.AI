package com.practisespring.Practise_spring.repository;
import java.util.Optional;
import com.practisespring.Practise_spring.entity.PdfSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PdfSessionRepository extends JpaRepository<PdfSession, Long> {
    Optional<PdfSession> findByFileHash(String fileHash);
}
