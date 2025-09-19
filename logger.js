
function logSection(title, data) {
    if (data && Object.keys(data).length > 0) {
        console.log(`${title}:`, JSON.stringify(data, null, 2));
        console.log('---------------------------------------------');
    }
}

function logger(req, res, next) {
    const start = Date.now();
    const timestamp = new Date().toISOString();

    console.log('\n================= 🤖 Logger =================');
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    console.log('---------------------------------------------');

    logSection('📌 Headers', req.headers);
    logSection('📦 Body', req.body);
    logSection('🔎 Query', req.query);
    logSection('🧩 Params', req.params);

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`✅ Completed: status ${res.statusCode} in ${duration}ms`);
        console.log('================================================\n');
    });

    next();
}

module.exports = logger;