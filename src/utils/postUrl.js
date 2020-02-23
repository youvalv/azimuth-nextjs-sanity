const _ = require('lodash');
const withPrefix = require('./withPrefix').default;


export default function(post) {
    const slug = _.trim(_.get(post, 'slug.current'), '/');
    return withPrefix(`/blog/${slug}`);
}
