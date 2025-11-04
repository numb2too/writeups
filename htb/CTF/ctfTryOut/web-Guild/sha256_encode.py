import hashlib

email = "6a36397441573374@master.guild"
reset_url = str(hashlib.sha256(email.encode()).hexdigest())
print(reset_url)
