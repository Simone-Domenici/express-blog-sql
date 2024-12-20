const posts = require('../data/posts.js')
const categories = require('../data/categories.js')
let lastIndex = posts.at(-1).id
const db = require('../config/db.js');
const connection = require('../config/db.js');


// Index
function index(req, res) {
    console.log('Lista dei post')
    const sql = 'SELECT * FROM posts';
    connection.query(sql, (err, result) => { 
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(result);
    });  
}
// Show
function show(req, res) {
    const postId = req.post.id;
    connection.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database query error' });
            return;
        }
        if (results.length === 0) {
			return res.status(404).json({ error: 'Post not found' })
        }
        res.json(results[0]);
    });
}
// Store
function store(req, res) {
    console.log('Creazione del post')
    const { title, content, image, tags, category, published = true } = req.body

    const errors = validate(req)

    if (errors.length) {

        res.status(400)

        return res.json({
            error: 'Invalid request',
            messages: errors,
        })
    }

    lastIndex++
    const slug = createSlug(title)

    const post = {
        id: lastIndex,
        title,
        slug,
        content,
        image,
        tags: [tags],
        category,
        published
    }

    posts.push(post)
    res.status(201).send(post)
}

// Update
function update(req, res) {

    const errors = validate(req)

    if (errors.length) {
        res.status(400)

        return res.json({
            error: 'Invalid request',
            messages: errors,
        })
    }

    const { title, image, content, tags } = req.body

    req.post.title = title
    req.post.slug = createSlug(title)
    req.post.content = content
    req.post.image = image
    req.post.tags = tags

    res.json(req.post)
}
// Modify
function modify(req, res) {
    const { title, image, content, tags } = req.body

    if (title) {
    req.post.title = title
    req.post.slug = createSlug(title)
    }
    if (content) req.post.content = content
    if (image) req.post.image = image
    if (tags) req.post.tags = tags

    res.json(req.post)
    }

    // Destroy
    function destroy(req, res) {
        const postId = req.post.id;
        connection.query('DELETE FROM posts WHERE id = ?', [postId], (err) => {
            if (err) {
                res.status(500).json({ error: 'Database query error' });
                return;
        }
        res.sendStatus(204);
    });
    }

    module.exports = { index, show, store, update, modify, destroy,}

    // Funzioni

    function validate(req) {
        const { title, content, image, tags, category, published = true } = req.body

        const errors = []

        if (!title) {
            errors.push('Title is required')
        }

        if (!category) {
            errors.push('Category is required')
        }

        if (!content) {
            errors.push('Content is required')
        }

        if (!tags) {
            errors.push('Tags is required')
        }

        return errors
    }


    function createSlug(title) {
        // Rimuovi caratteri speciali e accent
        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '') // Rimuovo caratteri non alfanumerici, spazi e trattini
            .replace(/\s+/g, '-') // Sostituisco spazi multipli con un singolo trattino
            .replace(/-+/g, '-'); // Rimuovo trattini multipli

        return slug;
    }