package loldle.data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "champion")
public class Champion {

    @Id
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