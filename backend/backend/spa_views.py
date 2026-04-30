import mimetypes
from pathlib import Path

from django.http import FileResponse, Http404


def spa_catch_all(request, path, document_root):
    """Serve Vite-built files from document_root; unknown paths return index.html for SPA routing."""
    root = Path(document_root).resolve()
    if not root.is_dir():
        raise Http404()
    if path:
        candidate = (root / path).resolve()
        try:
            candidate.relative_to(root)
        except ValueError as exc:
            raise Http404() from exc
        if candidate.is_file():
            ctype, _ = mimetypes.guess_type(str(candidate))
            return FileResponse(candidate.open("rb"), content_type=ctype or "application/octet-stream")
    index = root / "index.html"
    if not index.is_file():
        raise Http404()
    return FileResponse(index.open("rb"), content_type="text/html")
