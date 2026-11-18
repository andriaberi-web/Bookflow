# Bookflow

Bookflow turns PDF books into EPUBs that read like real books. It's a Django + React app,
run on your own computer, on [PDF2EPUB](https://github.com/andriaberi/PDF2EPUB), the
engine that finds a book's chapters, paragraphs, notes and cover. It's in
English and Georgian, in light and dark.

Upload a PDF, watch it being read, then fix the book in the editor, side by side with the
PDF page and the EPUB page, and download the EPUB. The PDF and the edits are deleted once
you leave the book's page.

## Running it

Python 3.12+ and Node 22.

```sh
make install       # .venv, backend and frontend packages, backend/.env from .env.example
make dev           # Django on :8000 and React on :3000; open http://localhost:3000
```

`make check` runs Django's checks and the backend tests; `npm test` and `npm run lint` in
`frontend/` run the frontend's. `make help` lists everything else.

## Configuration

`backend/.env` (see `backend/.env.example`):

| Setting | What it is |
| --- | --- |
| `PDF2EPUB_SOURCE` | Where `make install-engine` installs PDF2EPUB from: a folder (installed editable, so changes there show up at once) or anything pip installs, such as a release tag |
| `MAX_PDF_SIZE_MB`, `MAX_PDF_PAGES` | The largest PDF the converter takes: 500 MB and 5000 pages if left out |

## Contributing

Contributions are welcome under the [Developer Certificate of Origin](https://developercertificate.org/):
sign off each commit (`git commit -s`) to certify you wrote it, or otherwise have the right
to submit it under this project's license. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
and the [code of conduct](docs/CODE_OF_CONDUCT.md).

## License

[GNU AGPL-3.0](LICENSE) or later, © 2026 Andria Beridze, with one added term (see
[NOTICE](NOTICE)): anything built on Bookflow must show its users this credit:

> Based on Bookflow by Andria Beridze (https://github.com/andriaberi-web/Bookflow)

PDF2EPUB, the engine, is AGPL too, with its own credit.
