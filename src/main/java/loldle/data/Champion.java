package loldle.data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "champions")
public class Champion {

   @Id
    private int id;

   @Column(name = "name")
    private String name;
    @Column(name = "gender")
    private String gender;
    private String position;
    private String species;
    private String resource;
    private String rangeType;
    private String region;
    private int releaseYear;

    public Champion(int id, String name, String gender, String position,
                    String species, String resource, String rangeType,
                    String region, int releaseYear) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.position = position;
        this.species = species;
        this.resource = resource;
        this.rangeType = rangeType;
        this.region = region;
        this.releaseYear = releaseYear;
    }

    public Champion() {
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getGender() {
        return gender;
    }

    public String getPosition() {
        return position;
    }

    public String getSpecies() {
        return species;
    }

    public String getResource() {
        return resource;
    }

    public String getRangeType() {
        return rangeType;
    }

    public String getRegion() {
        return region;
    }

    public int getReleaseYear() {
        return releaseYear;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public void setResource(String resource) {
        this.resource = resource;
    }

    public void setRangeType(String rangeType) {
        this.rangeType = rangeType;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public void setReleaseYear(int releaseYear) {
        this.releaseYear = releaseYear;
    }

    @Override
    public String toString() {
        return "Champion{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", gender='" + gender + '\'' +
                ", position='" + position + '\'' +
                ", species='" + species + '\'' +
                ", resource='" + resource + '\'' +
                ", rangeType='" + rangeType + '\'' +
                ", region='" + region + '\'' +
                ", releaseYear=" + releaseYear +
                '}';
    }
}