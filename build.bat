bash -i -c "bundle exec jekyll build"
docker build -t docker.pkg.github.com/richardthombs/agilesnowball.com/agilesnowball-website:latest .
docker push docker.pkg.github.com/richardthombs/agilesnowball.com/agilesnowball-website:latest
