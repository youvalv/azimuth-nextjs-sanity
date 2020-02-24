const _ = require('lodash');

const { getResolvedObjectOfUserTypes } = require('./sanity-tools');

module.exports = async function sanityFetchData() {
    const pageTypes = ['landing', 'page', 'blog', 'post'];
    const data = await getResolvedObjectOfUserTypes();
    const config = _.find(data, {_type: 'site_config'});
    const posts = _.filter(data, {_type: 'post'});
    const pages = _.chain(data)
        .filter(item => _.includes(pageTypes, _.get(item, '_type')))
        .map(page => {
            const pageType = _.get(page, '_type');
            let slug = _.get(page, 'slug.current');

            if (!slug) {
                console.error(`page has no slug,  pageType: ${pageType}, pageId: ${_.get(page, '_id')}`);
                return null;
            }

            slug = _.trim(slug, '/');

            if (pageType === 'post') {
                slug = `/blog/${slug}`;
            } else {
                slug = '/' + slug;
            }

            return {
                slug: slug,
                data: page
            };
        })
        .compact()
        .value();
    return { config, pages, posts };
};
