#!/usr/bin/env bash
set -e
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
# 1) Create start.sh at the ROOT of the repo
@'
#!/usr/bin/env bash
set -e

# install backend deps
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt

# run the FastAPI app
cd backend
uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8080}"
