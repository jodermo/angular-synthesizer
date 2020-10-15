# Angular Synthesizer
Demo: [synthesizer.petzka.com](http://synthesizer.petzka.com)

Modular Synthesizer • Angular • Web Audio API • Web MIDI API • MIDI Device Detection • Local Storage
###### *© 2019 - Moritz Petzka - [petzka.com](https://petzka.com/)*
<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.

| Frameworks |  | Links |
|    ---:| :---          | :---         |
| <img src="https://angular.io/assets/images/logos/angular/angular.svg" height="64"  alt="Angular Logo" /> Angular | Integration as Angular Module | [WEBSITE](https://angular.io) <br> [DOCS](https://angular.io/docs)|
| <img src="https://material.angular.io/assets/img/angular-material-logo.svg" height="64"  alt="Angular Logo" /> Angular Material  | Uses Angular Material | [WEBSITE](https://material.angular.io/) <br> [DOCS](https://material.angular.io/guide/getting-started)|
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/W3C%C2%AE_Icon.svg/1200px-W3C%C2%AE_Icon.svg.png" height="64" alt="Nest Logo" /><br> Web Audio API | Generate and modify audio in browser | [INFOS](https://www.w3.org/TR/webaudio/)|
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/W3C%C2%AE_Icon.svg/1200px-W3C%C2%AE_Icon.svg.png" height="64" alt="Nest Logo" /><br> Web MIDI API | Use MIDI devices in browser | [INFOS](https://www.w3.org/TR/webmidi/)|


## Angular integration
To integrate this module in your Angular project:
### Add import to `app/app.module.ts`


```javascript
  imports: [
    SynthesizerModule
  ],
```

### Load the Synthesizer component in your template `...component.html`
```html
 <app-synthesizer></app-synthesizer>
```
<br><br>
##### ! Note: Angular Material has to be installed
Install Angular Material in your Project with:
`ng add @angular/material`
