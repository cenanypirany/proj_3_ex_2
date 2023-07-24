-- Create database: animal_sightings_db and run the statements in the Query Tool:

CREATE TABLE animals (
    animal_id integer NOT NULL,
    common_name character varying(255),
    scientific_name character varying(255),
    taxon_family_name character varying(255)
);

CREATE TABLE countries (
    country_abbr character varying(255),
    country character varying(255)
);

CREATE TABLE sightings (
    sighting_id integer NOT NULL,
    animal_id integer,
    observed_on date,
    latitude numeric,
    longitude numeric,
    image_url character varying(255),
    country_abbr character varying(255)
);