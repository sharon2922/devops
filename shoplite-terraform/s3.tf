resource "aws_s3_bucket" "shoplite_images" {
  bucket = var.s3_bucket_name

  tags = {
    Name = "shoplite-images"
  }
}

resource "aws_s3_bucket_public_access_block" "shoplite_images" {
  bucket = aws_s3_bucket.shoplite_images.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "shoplite_images" {
  bucket = aws_s3_bucket.shoplite_images.id
  depends_on = [aws_s3_bucket_public_access_block.shoplite_images]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.shoplite_images.arn}/*"
    }]
  })
}