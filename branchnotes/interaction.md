directives/interaction.md

these get used on the fln-ol-map directive

  fln-draw
    add interaction
    remove on $destroy
  fln-select
    add interaction
      remove on $destroy
  fln-modify
    add interaction
      remove on $destroy

  fln-click-pan
    add template to map
    on click, shift map center
    turns on drag pan
    off when $destroy
