package loldle.data;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "champion")
public class Champion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "gender")
    private String gender;

    @Column(name = "position")
    private String position;

    @Column(name = "species")
    private String species;

    @Column(name = "resource")
    private String resource;

    @Column(name = "range_type")
    private String rangeType;

    @Column(name = "region")
    private String region;

    @Column(name = "release_year")
    private int releaseYear;


    public Champion() {
    }
}