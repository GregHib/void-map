'use strict';

export class Converter {
    
    fromJava(text, drawable) {}
    
    toJava(drawable) {
        switch ($("#output-type").val()) {
            case "Groml":
                return this.toGroml(drawable);
            case "Array":
                return this.toJavaArray(drawable);
            case "List":
                return this.toJavaList(drawable);
            case "Arrays.asList":
                return this.toJavaArraysAsList(drawable);
            case "Raw":
                return this.toRaw(drawable);
        }
    }
    
    toRaw(drawable) {}

    toGroml(drawable) {}

    toJavaSingle(drawable) {}
    
    toJavaArray(drawable) {}
    
    toJavaList(drawable) {}
    
    toJavaArraysAsList(drawable) {}
}