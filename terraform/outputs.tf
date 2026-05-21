# Module 5: Terraform Outputs

output "server_public_ip" {
  description = "Public IP of the DevOps server"
  value       = aws_eip.devops_eip.public_ip
}

output "server_instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.devops_server.id
}

output "security_group_id" {
  description = "Security Group ID"
  value       = aws_security_group.devops_sg.id
}

output "ssh_command" {
  description = "SSH command to connect to the server"
  value       = "ssh -i your-key.pem ubuntu@${aws_eip.devops_eip.public_ip}"
}
