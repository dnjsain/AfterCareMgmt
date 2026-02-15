@echo off
cd /d "c:\Users\dnsja\Desktop\AfterCareMgmt"
git add .
git commit -m "Fix redirect loop on Vercel"
git push origin main
del "%~f0"
