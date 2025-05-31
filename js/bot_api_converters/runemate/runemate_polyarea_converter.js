'use strict';

import {PolyArea} from '../../model/PolyArea.js';
import {Position} from '../../model/Position.js';
import {OSBotPolyAreaConverter} from '../osbot/osbot_polyarea_converter.js';

export class RuneMatePolyAreaConverter extends OSBotPolyAreaConverter {

    constructor() {
        super();
        this.javaArea = "Area";
        this.javaPosition = "Coordinate";
    }
    
    fromJava(text, polyarea) {
        polyarea.removeAll();
        text = text.replace(/\s/g, '');

        var positionsPattern = `new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\)`;
        var re = new RegExp(positionsPattern, "mg");
        var match;
        while ((match = re.exec(text))) {
            var values = match[1].split(",");
            
            var z = values.length == 2 ? 0 : values[2];
            
            polyarea.add(new Position(values[0], values[1], z));
        }
    }
    
    toJava(polyarea) {
        if (polyarea.positions.length == 0) {
            return "";
        }
        var output = `${this.javaArea} area = new ${this.javaArea}.Polygonal(`;
        for (var i = 0; i < polyarea.positions.length; i++) {
            var position = polyarea.positions[i];
            output += `\n    new ${this.javaPosition}(${position.x}, ${position.y}, ${position.z})`;
            if (i !== polyarea.positions.length - 1) {
                output += ",";
            }
        }
        output += "\n);";
        return output;
    }



    fromGroml(text, polyarea) {
        polyarea.removeAll();
        text = text.replaceAll(' ', '')
        var x = {}
        var y = {}
        var level = 0
        var lines = text.split("\n")
        for (let i = 0; i < lines.length; i++) {
            var line = lines[i]
            let value = line.split('=')[1];
            switch (line[0]) {
                case 'x':
                    x = this.parseNumberArray(value)
                    break;
                case 'y':
                    y = this.parseNumberArray(value)
                    break;
                case 'l':
                    level = parseFloat(value)
                    break;
            }
        }
        for (let i = 0; i < x.length; i++) {
            polyarea.add(new Position(x[i], y[i], level));
        }
    }

    parseNumberArray(str) {
        const numberArray = str
            .replace(/^\s*\[\s*|\s*\]\s*$/g, '')  // remove brackets and surrounding spaces
            .split(',')                            // trim spaces
            .filter(s => s.length > 0)            // skip empty strings
            .map(parseFloat);

        if (numberArray.some(isNaN)) {
            throw new Error("Invalid number in input string");
        }

        return numberArray;
    }

    toGroml(polyarea) {
        if (polyarea.positions.length == 0) {
            return "";
        }
        var output = `x = [`;
        for (var i = 0; i < polyarea.positions.length; i++) {
            output += `${polyarea.positions[i].x}`;
            if (i !== polyarea.positions.length - 1) {
                output += ",";
            }
        }
        output += "]\ny = [";
        for (var i = 0; i < polyarea.positions.length; i++) {
            output += `${polyarea.positions[i].y}`;
            if (i !== polyarea.positions.length - 1) {
                output += ",";
            }
        }
        output += ']\n'
        if (polyarea.positions.length > 0 && polyarea.positions[0].z > 0) {
            output += `level = ${polyarea.positions[0].z}\n`;
        }
        return output;
    }
}