$ErrorActionPreference = "Stop"

$outDir = "stitch_screens"
If (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir
}

Write-Host "Downloading Screen 1: Merchant Dashboard..."
curl.exe -L "https://lh3.googleusercontent.com/aida/ADBb0ugq0OHg8pVPhTqRTxiVD1DqWr3khJ-9xb2kOUnBDP_ckXQB3a7JVwKde9lkBiVrh6aBIra0MkJm1t13ysMaQrledyLvxMy1g2FCCrm4slxrAFO4Dv1rkgd35bhbyDYWwtCsJRKAVLR1xiYvvN0k6g7M6sLLjd33lvbFYOs9PgPQRucp8mst94nJqmK0GeL4ptqGD4LaaxNupBlR8jPen0A1JxbRzfyvsslE7HgSXPJncv4PjnAEvLSfbA" -o "$outDir/1_merchant_dashboard.png"
curl.exe -L "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sX2U1MGVkZDM4YjdjMDQ4NzQ5MmI2NWY3MjRmMjkzN2Y4EgsSBxCF-671pgUYAZIBIgoKcHJvamVjdF9pZBIUQhI3NTk2MzYyMTU2ODA4MDU1NTc&filename=&opi=89354086" -o "$outDir/1_merchant_dashboard.html"

Write-Host "Downloading Screen 2: Point of Sale..."
curl.exe -L "https://lh3.googleusercontent.com/aida/ADBb0uj_CJpEvLeV6_uBppesh-wcWHn2mt5fBLfJao0-z5BAkFXqKWLNzwKclBIce58_RFDS-TPG4XAQpa3EV3LLqFEPKHho6hcHhclVXlLeyYQOWs2VkF3Pu9kE7Hs4AhgUJh6q6D82l5IUZcRIPEHIlJWSmwlxxBhC8UvM0fN9stf26xOUyhtJfW7O8zsNF6XFJu-Jq1tDmemJzp4TH7LBfp-g8U6lRy1kuq5YlDMzduKSQaCTtzdmezcPUQ" -o "$outDir/2_point_of_sale.png"
curl.exe -L "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sX2ZmYzNlYjcwMmZiYjQ2YTU5M2VjMmZmOTMwMDY4NTM4EgsSBxCF-671pgUYAZIBIgoKcHJvamVjdF9pZBIUQhI3NTk2MzYyMTU2ODA4MDU1NTc&filename=&opi=89354086" -o "$outDir/2_point_of_sale.html"

Write-Host "Downloading Screen 3: Inventory & Yield Tracking..."
curl.exe -L "https://lh3.googleusercontent.com/aida/ADBb0uggBsbYV1Y7wq2a5oaZyh7bjlsNI8wdFtbHMEJwguHVailXhmcloP_IE1kH4qRtvAWNDEuD83QpUOJyZELRNPJKtdyzr_fNxuOHC1KLqEmZQC9p7XxO2HNfg0NWdG9KOvwu5Sa9Gc8JsVo_C8SJxMddYxqMHdqzmnTwa7IaJAkEYpzpdru7iHtlqz4cAk7AqW6FltFag7VByV9L5-U2iBbMUjFjoJsChWDF8RupSS5XLoV6_p5_vF5W" -o "$outDir/3_inventory_yield_tracking.png"
curl.exe -L "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzJmODJhYTcxMGY0MTQzOTQ5ZDkwOGRmNjZjNmI4Zjg4EgsSBxCF-671pgUYAZIBIgoKcHJvamVjdF9pZBIUQhI3NTk2MzYyMTU2ODA4MDU1NTc&filename=&opi=89354086" -o "$outDir/3_inventory_yield_tracking.html"

Write-Host "Downloading Screen 4: Optimized Client CRM & Debt Ledger..."
curl.exe -L "https://lh3.googleusercontent.com/aida/ADBb0ugSGImYZPP4pXjIWWUN49NeN2YMw1BqKxgKwPz15NRE_w6iPS9jzwaCkUuMGTV18oU4QkNBPEm5RR2AwQ8Rpa3QO0GDwlV9zf4uOy7Oz9J6QUhGteOwt2en-ouuKKdIUj6FNBRBcjxV9Ik5MHSUK0Bc4fbAxjyex76Yxzhd3-QaNYmwzRUdx0MXBWL6XZK6M_onYj4KjsMmoP7k-FlE9X9hBjwUTSdMXb-FCNVa63UhB3sd8BAnJsWe8g" -o "$outDir/4_optimized_client_crm.png"
curl.exe -L "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sX2QxZDk3NWNiNmQyOTQ2MTFhYzQyNzU1ZDVlYjZjZGViEgsSBxCF-671pgUYAZIBIgoKcHJvamVjdF9pZBIUQhI3NTk2MzYyMTU2ODA4MDU1NTc&filename=&opi=89354086" -o "$outDir/4_optimized_client_crm.html"

Write-Host "Downloading Screen 5: Shop Onboarding..."
curl.exe -L "https://lh3.googleusercontent.com/aida/ADBb0ujdLv4iNJNnUInwbMWANN_3l_nPq-gw0sB2hlsC8BGFv1f4y1Y4KRL3WuCmaAOop_XQ7xEJ0O4uhNarPjcrECtSTxlOgcqWMB0UjxBpcoPOGq3ZaUC3nQ6Msle7eXW7aPoQSpVHGJgFJvrJT2gfYn6-XuJ192qqJz1Wvjo-N4ebs9UOt6jkaAsJ-Dm6wNlvT8ME3R6_UkCODGEezb0y7-TNBPEyopEbcsgAI0LPVCVlNI5KRQcbZUfBtg" -o "$outDir/5_shop_onboarding.png"
curl.exe -L "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzNmMTAzNGRkYzQxNzRlZTZiYjczNDhjNmIwNjk5ZTdlEgsSBxCF-671pgUYAZIBIgoKcHJvamVjdF9pZBIUQhI3NTk2MzYyMTU2ODA4MDU1NTc&filename=&opi=89354086" -o "$outDir/5_shop_onboarding.html"

Write-Host "Downloading Screen 6: User Management..."
curl.exe -L "https://lh3.googleusercontent.com/aida/ADBb0ugqmUUefPFeAFSD68q9hC4_IUcmViljGgrrGlhCjdyhmAieCccX4VM-QS9bUeZDV9IK7vLH47FYZJ8p1-3BpLc3feiTrtzs9nw7ckSZmRnFWH82d_1OCkuA2Wq_wVDnk7EAvVk-CzAdeHLHeVIwWoR0YxDucajYKdI7gVkEAhjrcoFIMnN4s4DVLRjxbjpHFZ3jNH_b1ONljUVqXv1JKbCsEeATrMrBa9qlzopwbIMpdanux3X4-PVVyw" -o "$outDir/6_user_management.png"
curl.exe -L "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzE3NWYwYjY4YTBjMjRiZTk4NDIxZWNlYWI2YWQwNWE0EgsSBxCF-671pgUYAZIBIgoKcHJvamVjdF9pZBIUQhI3NTk2MzYyMTU2ODA4MDU1NTc&filename=&opi=89354086" -o "$outDir/6_user_management.html"

Write-Host "All downloads completed!"
