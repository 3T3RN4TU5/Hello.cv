Add-Type -AssemblyName System.Drawing

function New-OgImage($path, $w, $h) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'AntiAliasGridFit'

  $g.Clear([System.Drawing.Color]::FromArgb(255, 5, 7, 13))

  # radial-ish glow (concentric ellipses)
  for ($i = 26; $i -ge 1; $i--) {
    $alpha = [int](3.2 - $i * 0.11); if ($alpha -lt 1) { $alpha = 1 }
    $p = $i * 11
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($alpha, 79, 140, 255))
    $g.FillEllipse($brush, ($w * 0.62 - $p), ($h * 0.38 - $p), $p * 2, $p * 2)
    $brush.Dispose()
  }

  # faint grid
  $gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(14, 148, 163, 184), 1)
  for ($x = 0; $x -lt $w; $x += 48) { $g.DrawLine($gridPen, $x, 0, $x, $h) }
  for ($y = 0; $y -lt $h; $y += 48) { $g.DrawLine($gridPen, 0, $y, $w, $y) }
  $gridPen.Dispose()

  $display = New-Object System.Drawing.Font('Segoe UI', 88, [System.Drawing.FontStyle]::Bold)
  $sub     = New-Object System.Drawing.Font('Segoe UI', 40, [System.Drawing.FontStyle]::Regular)
  $mono    = New-Object System.Drawing.Font('Consolas', 26, [System.Drawing.FontStyle]::Regular)

  $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle(0, 150, $w, 220)),
    [System.Drawing.Color]::FromArgb(255, 79, 140, 255),
    [System.Drawing.Color]::FromArgb(255, 34, 211, 238), 0)
  $white = [System.Drawing.Brushes]::White
  $muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 148, 163, 184))

  # center text inside full-width rectangles (PointF + Center alignment clips)
  $r1 = New-Object System.Drawing.RectangleF(0, 150, $w, 170)
  $r2 = New-Object System.Drawing.RectangleF(0, 320, $w, 80)
  $r3 = New-Object System.Drawing.RectangleF(0, 400, $w, 60)
  $r4 = New-Object System.Drawing.RectangleF(0, 470, $w, 60)
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = 'Center'
  $fmt.LineAlignment = 'Center'

  $dot = [string][char]0x00B7
  $g.DrawString('JEEVAN', $display, $grad, $r1, $fmt)
  $g.DrawString('Full-Stack Web Developer', $sub, $white, $r2, $fmt)
  $g.DrawString(("MERN  $dot REST APIs  $dot Data Analytics  $dot ML"), $mono, $muted, $r3, $fmt)

  $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 34, 211, 238), 3)
  $g.DrawLine($linePen, ($w/2 - 120), 455, ($w/2 + 120), 455)
  $linePen.Dispose()

  $g.DrawString('github.com/3T3RN4TU5', $mono, $muted, $r4, $fmt)

  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "saved $path"
}

New-OgImage 'D:\FullStack\DigitalCV\public\og-image.png' 1200 630
