<?php
$p = isset($_GET['p']) ? (int) $_GET['p'] : 1;
$p = max(1, min(604, $p));
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#8b6914">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="مصحف">
    <title>مصحف — صفحة <?php echo $p; ?></title>
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="icons/icon.svg">
    <link rel="stylesheet" href="assets/app.css">
</head>
<body>
    <main class="viewer" id="viewer">
        <img
            id="page-image"
            src="https://cdn.jsdelivr.net/gh/QuranHub/quran-pages-images@main/kfgqpc/hafs-wasat/<?php echo $p; ?>.jpg"
            alt="صفحة المصحف <?php echo $p; ?>"
            fetchpriority="high"
            decoding="async"
        >
    </main>
    <header class="header">
        <nav class="nav">
            <a href="light.php<?php echo $p > 1 ? '?p=' . $p : ''; ?>" class="link-light">عرض خفيف</a>
            <button type="button" class="btn btn-prev" id="btn-prev" aria-label="الصفحة السابقة">السابق</button>
            <div class="page-info">
                <label for="page-input">صفحة</label>
                <input type="number" id="page-input" min="1" max="604" value="<?php echo $p; ?>" aria-label="رقم الصفحة">
                <span class="page-total">من 604</span>
            </div>
            <button type="button" class="btn btn-next" id="btn-next" aria-label="الصفحة التالية">التالي</button>
        </nav>
    </header>
    <script>
        window.MUSHAF_PAGE = <?php echo $p; ?>;
        window.MUSHAF_TOTAL = 604;
    </script>
    <script src="assets/app.js"></script>
</body>
</html>
