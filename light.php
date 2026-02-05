<?php
$p = isset($_GET['p']) ? (int) $_GET['p'] : 1;
$p = max(1, min(604, $p));
$pagePad = str_pad((string) $p, 3, '0', STR_PAD_LEFT);
$imgSrc = 'https://cdn.jsdelivr.net/gh/tarekeldeeb/madina_images@w1024/w1024_page' . $pagePad . '.png';
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
    <title>مصحف — عرض خفيف — صفحة <?php echo $p; ?></title>
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="icons/icon.svg">
    <link rel="stylesheet" href="assets/app.css">
</head>
<body class="light-page opts-bg-default">
    <header class="header">
        <nav class="nav">
            <a href="index.php<?php echo $p > 1 ? '?p=' . $p : ''; ?>" class="link-light">عرض كامل</a>
            <div class="opts">
                <label for="opt-bg">خلفية</label>
                <select id="opt-bg" aria-label="اختيار الخلفية">
                    <option value="default">فاتح</option>
                    <option value="white">أبيض</option>
                    <option value="cream">كريم</option>
                    <option value="gray">رمادي فاتح</option>
                    <option value="green">أخضر فاتح</option>
                    <option value="dark">داكن</option>
                </select>
                <label for="opt-border">إطار</label>
                <select id="opt-border" aria-label="اختيار الإطار">
                    <option value="none">بدون</option>
                    <option value="madani">مديني</option>
                    <option value="classic">كلاسيكي</option>
                    <option value="luxury">فاخر</option>
                </select>
            </div>
            <button type="button" class="btn btn-prev" id="btn-prev" aria-label="الصفحة السابقة">السابق</button>
            <div class="page-info">
                <label for="page-input">صفحة</label>
                <input type="number" id="page-input" min="1" max="604" value="<?php echo $p; ?>" aria-label="رقم الصفحة">
                <span class="page-total">من 604</span>
            </div>
            <button type="button" class="btn btn-next" id="btn-next" aria-label="الصفحة التالية">التالي</button>
        </nav>
    </header>
    <main class="viewer" id="viewer">
        <div class="mushaf-frame opts-border-none" id="mushaf-frame">
            <img
                id="page-image"
                src="<?php echo htmlspecialchars($imgSrc); ?>"
                alt="صفحة المصحف <?php echo $p; ?>"
                fetchpriority="high"
                decoding="async"
            >
        </div>
    </main>
    <script>
        window.MUSHAF_PAGE = <?php echo $p; ?>;
        window.MUSHAF_TOTAL = 604;
    </script>
    <script src="assets/app-light.js"></script>
</body>
</html>
