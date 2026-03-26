from fastapi import FastAPI

app=FastAPI()
@app.get("/about")
def hello():
    return {'message':"Hello world"}