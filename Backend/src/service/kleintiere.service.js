"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Kleintierdaten. 
 */
export default class KleintiereService {
    
    constructor() {
        this._kleintiere = DatabaseFactory.database.collection("kleintiere");
    }

    /**
     * Kleintierdaten suchen.
     */
    async search(query) {
        let cursor = this._kleintiere.find(query, {
            sort: {
                name: 1,
                alter: 1,
                geschlecht: 1,
                zustand: 1,
                rasse: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Kleintierdatensatzes.
     */
    async create(kleintiere) {
        kleintiere = kleintiere || {};

        let newKleintier = {
            name:       kleintiere.name|| "",
            alter:      kleintiere.alter  || "",
            geschlecht: kleintiere.geschlecht     || "",
            zustand:    kleintiere.zustand      || "",
            rasse:      kleintiere.rasse   || "",
        };

        let result = await this._kleintiere.insertOne(newKleintier);
        return await this._kleintiere.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines vorhandenen Kleintierdatensatzes anhand seiner ID.
     */
    async read(id) {
        let result = await this._kleintiere.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Kleintierdatensatzes, durch Überschreiben einzelner Felder
     * oder des gesamten Kleintierobjekts (ohne die ID).
     */
    async update(id, kleintiere) {
        let oldKleintier = await this._kleintiere.findOne({_id: new ObjectId(id)});
        if (!oldKleintier) return;

        let updateDoc = {
            $set: {},
        }

        if (kleintiere.name)             updateDoc.$set.name        = kleintiere.name;
        if (kleintiere.alter)            updateDoc.$set.alter       = kleintiere.alter;
        if (kleintiere.geschlecht)       updateDoc.$set.geschlecht  = kleintiere.geschlecht;
        if (kleintiere.zustand)          updateDoc.$set.zustand     = kleintiere.zustand;
        if (kleintiere.rasse)            updateDoc.$set.rasse       = kleintiere.rasse;

        await this._kleintiere.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._kleintiere.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen eines Kleintierdatensatzes anhand seiner ID.
     */
    async delete(id) {
        let result = await this._kleintiere.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
