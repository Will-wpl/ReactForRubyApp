FROM ruby:2.4.1

MAINTAINER reubentwk@spgroup.com.sg

# ARG BUILD_RAILS_CMD="bundle install && yarn config set registry http://nexus.in.spdigital.io/repository/npmjs-all/ && yarn config set strict-ssl false"
# ARG http_proxy=http://proxy.singaporepower.com.sg:8080
# ARG https_proxy=http://proxy.singaporepower.com.sg:8080

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -yq --no-install-recommends nodejs yarn vim && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . ./

RUN /bin/bash -c "$BUILD_RAILS_CMD"

# ENTRYPOINT ["bundle", "exec"]

CMD ["rails", "server", "-b", "0.0.0.0", "-e", "$RAILS_ENV"]