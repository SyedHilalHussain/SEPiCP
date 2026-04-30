import mimetypes
from pathlib import Path

from django.http import FileResponse, Http404
from django.conf import settings


def spa_catch_all(request, path, document_root):
    """Serve Vite-built files from document_root; unknown paths return index.html for SPA routing."""
    root = Path(document_root).resolve()
    if not root.is_dir():
        raise Http404()
    if path:
        # When mounted under a subdirectory (e.g. IIS application `/SEPiCP`), some servers
        # may include the mount prefix in PATH_INFO. Strip it if present so we can find assets.
        mount = (getattr(settings, "FORCE_SCRIPT_NAME", "") or "").strip("/")
        if mount and path.startswith(mount + "/"):
            path = path[len(mount) + 1 :]

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
