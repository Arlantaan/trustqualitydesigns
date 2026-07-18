import smtplib
USER = "info@trustqualitydesign.com"
PASS = "Qwertyuiop12345$$$$$$"
try:
    s = smtplib.SMTP("mail.privateemail.com", 587, timeout=10)
    s.ehlo()
    s.starttls()
    s.ehlo()
    s.login(USER, PASS)
    s.quit()
    print("SUCCESS - password is correct")
except smtplib.SMTPAuthenticationError as e:
    print("FAIL - wrong password:", e)
except Exception as e:
    print("FAIL - other:", type(e).__name__, e)
