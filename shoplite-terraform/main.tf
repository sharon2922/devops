provider "aws" {
  region = var.aws_region
}

resource "aws_instance" "shoplite" {
  ami                    = "ami-080254318c2d8932f"
  instance_type          = "t3.small"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.shoplite_sg.id]

  tags = {
    Name = "shoplite-server"
  }
}