'use strict';

export const RS_TILE_WIDTH_PX = 32, RS_TILE_HEIGHT_PX = 32; // Width and height in px of an rs tile at max zoom level

export class Position {

    constructor(x, y, z) {
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.z = z;
    }

    static fromLatLng(map, latLng, z) {
        // No idea why y is off by one tile, it just is.
        return new Position(Math.floor(latLng.lng / 4), Math.floor(latLng.lat / 4) + 64, z);
    }

    toLatLng(map) {
        return Position.toLatLng(map, this.x, this.y)
    }

    toCentreLatLng(map) {
        return Position.toLatLng(map, this.x + 0.5, this.y + 0.5)
    }

    static toLatLng(map, x, y) {
        x = x * RS_TILE_WIDTH_PX
        y = -(y - 64) * RS_TILE_HEIGHT_PX
        return map.unproject(L.point(x, y), map.getMaxZoom());
    }

    getDistance(position) {
        var diffX = Math.abs(this.x - position.x);
        var diffY = Math.abs(this.y - position.y);
        return Math.sqrt((diffX * diffX) + (diffY * diffY));
    }

    toLeaflet(map) {
        var startLatLng = this.toLatLng(map)
        var endLatLng = new Position(this.x + 1, this.y + 1, this.z).toLatLng(map)

        return L.rectangle(L.latLngBounds(startLatLng, endLatLng), {
            color: "#33b5e5",
            fillColor: "#33b5e5",
            fillOpacity: 1.0,
            weight: 1,
            interactive: false
        });
    }

    getName() {
        return "Position";
    }

    equals(position) {
        return this.x === position.x && this.y === position.y && this.z === position.z;
    }

    toString() {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
};