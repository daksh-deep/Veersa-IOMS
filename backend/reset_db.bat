@echo off
echo WARNING: This will delete your SQLite DB and all migration files!

:: Step 1: Delete db.sqlite3
IF EXIST db.sqlite3 (
    del db.sqlite3
    echo 🗑️ Deleted db.sqlite3
) ELSE (
    echo ⚠️ db.sqlite3 not found
)

:: Step 2: Delete all migration files except __init__.py
FOR /R %%G IN (*\migrations\*) DO (
    FOR %%F IN (%%G\*.py) DO (
        IF NOT "%%~nxF"=="__init__.py" del "%%F"
    )
    FOR %%F IN (%%G\*.pyc) DO (
        del "%%F"
    )
)
echo 🗑️ Deleted migration files

:: Step 3: Make migrations
python manage.py makemigrations
echo ✅ Created new migrations

:: Step 4: Apply migrations
python manage.py migrate
echo ✅ Applied migrations - Database reset complete
pause
