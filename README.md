# MLOps House Price Prediction

End-to-end learning project:

Conda -> ML -> FastAPI -> Pytest -> Docker -> Docker Hub -> Kubernetes -> AWS EC2 -> GitHub Actions

## 1. Create Conda environment

```bash
conda create -p venv python=3.12
conda activate ./venv
```

Or use the included environment file:

```bash
conda env create -f environment.yml
conda activate mlops-house-price
```

## 2. Install dependencies

```bash
pip install -r requirements.txt
```

## 3. Train the model

```bash
python model/train.py
```

This creates:

```text
models/house_price_model.pkl
```

## 4. Run tests

```bash
pytest -q
```

## 5. Run FastAPI locally

```bash
uvicorn app.main:app --reload
```

Open:

- http://127.0.0.1:8000
- http://127.0.0.1:8000/health
- http://127.0.0.1:8000/docs

Example POST body for `/predict`:

```json
{
  "area": 2000,
  "bedrooms": 3,
  "bathrooms": 2,
  "age": 10
}
```

## 6. Build Docker image

First train the model:

```bash
python model/train.py
```

Build:

```bash
docker build -t house-price-api:1.0 .
```

Run:

```bash
docker run -d --name house-price-api -p 8000:8000 house-price-api:1.0
```

Open:

http://localhost:8000/docs

## 7. Push to Docker Hub

Login:

```bash
docker login
```

Tag:

```bash
docker tag house-price-api:1.0 YOUR_DOCKERHUB_USERNAME/house-price-api:1.0
```

Push:

```bash
docker push YOUR_DOCKERHUB_USERNAME/house-price-api:1.0
```

## 8. Kubernetes

Replace `DOCKERHUB_USERNAME` in `k8s/deployment.yaml`.

Apply:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

Check:

```bash
kubectl get pods
kubectl get deployments
kubectl get services
```

For Docker Desktop Kubernetes:

http://localhost:30080/docs

## 9. AWS EC2 + k3s

This project uses a single EC2 instance with k3s for learning.

On Ubuntu EC2:

```bash
sudo apt update
sudo apt install -y curl git
curl -sfL https://get.k3s.io | sh -
sudo kubectl get nodes
```

Clone the repository:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/mlops-house-price.git
cd mlops-house-price
```

Deploy:

```bash
sudo kubectl apply -f k8s/service.yaml
sudo kubectl apply -f k8s/deployment.yaml
```

The Kubernetes service uses NodePort 30080.

Allow TCP 30080 in the EC2 security group, then access:

http://EC2_PUBLIC_IP:30080/docs

## 10. GitHub Actions secrets

Create these repository secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `EC2_HOST`
- `EC2_USERNAME`
- `EC2_SSH_KEY`

`DOCKERHUB_TOKEN` should be a Docker Hub access token, not your normal password.

`EC2_HOST` = EC2 public IP or DNS name.

`EC2_USERNAME` = usually `ubuntu` for Ubuntu EC2.

`EC2_SSH_KEY` = contents of your private SSH key.

The workflow:

1. Installs Python 3.12
2. Installs dependencies
3. Trains the model
4. Runs pytest
5. Builds the Docker image
6. Pushes the image to Docker Hub
7. SSHs to EC2
8. Updates Kubernetes
9. Waits for rollout completion

## Important production note

This is an educational MLOps project. A production architecture would normally use AWS EKS rather than a single EC2-hosted k3s cluster, private networking, TLS/HTTPS, a proper model registry or artifact store, image vulnerability scanning, secrets management, monitoring, logging, autoscaling, and immutable image/model versioning.
# http://52.54.222.198:30080/docs
