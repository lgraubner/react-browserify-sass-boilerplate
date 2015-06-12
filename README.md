# Base project

## CSS

## Javascript

### GoogleMap

```Javascript
GoogleMap.create({
    name: "googlemap",
    container: "#gmap",
    coords: "54.1136509,12.0845318",
    options: {
        zoom: 8
    }
});
```

### StateManager

```Javascript
StateManager.addState({
    name: "mobile",
    maxWidth: 768,
    match: function() {

    },
    unmatch: function() {

    }
});

StateManager.init();
```

## Workflow
