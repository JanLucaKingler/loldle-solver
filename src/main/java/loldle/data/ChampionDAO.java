package loldle.data;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class ChampionDAO {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Champion> findAll() {
        return entityManager.createQuery("SELECT c FROM Champion c", Champion.class)
                .getResultList();
    }

    public Champion findByName(String name) {
        List<Champion> result = entityManager.createQuery(
                        "SELECT c FROM Champion c WHERE LOWER(c.name) = LOWER(:name)",
                        Champion.class)
                .setParameter("name", name)
                .getResultList();

        return result.isEmpty() ? null : result.get(0);
    }


    public void delete(Champion champion) {
        entityManager.remove(entityManager.contains(champion) ? champion : entityManager.merge(champion));
    }
}