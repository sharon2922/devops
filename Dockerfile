#use python image
FROM python:3.11

#set working directory
WORKDIR /app

#copy files
COPY . .

#install dependencies
RUN pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv

#expose port 
EXPOSE 8000

#run app 
CMD ["uvicorn","main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

