# lilnote

tiny little note-taking app in node

installation: `npm i -g lilnote`

lilnote will store its json notes in `~/.lilnote/db.json`

usage: `lilnote`

```shell
lilnote [note]      writes new [note]
lilnote [stdin]     writes directory from stdin
lilnote -s          shows all notes
lilnote -e          add/edit new note using $EDITOR
lilnote -r [note]   removes that note
lilnote -h          shows the help
```

license: wtfpl

contributions: welcome!

known bugs: can't remove note at `[1]`
