# Leger Example Deployments

This directory contains example quadlet deployments for common use cases.

## Available Examples

### nginx/
Simple nginx web server example demonstrating:
- Basic container deployment
- Port publishing
- Volume management

**Install:**
```bash
leger deploy install nginx-example --source ./examples/nginx
```

**Access:**
```bash
curl http://localhost:8080
```

## Creating Your Own Quadlets

Each quadlet deployment should contain:

1. **`.leger.yaml`** - Metadata file:
   ```yaml
   name: myapp
   version: 1.0.0
   scope: user
   description: Brief description

   ports:
     - 8080:80

   volumes:
     - myapp-data:/data

   secrets:  # Optional
     - name: leger/myapp/api-key
       podman-secret: myapp-api-key
       env: API_KEY
   ```

2. **`<name>.container`** - Container definition:
   ```ini
   [Unit]
   Description=My Application
   After=network-online.target

   [Container]
   Image=myapp:latest
   ContainerName=myapp
   PublishPort=8080:80
   Volume=myapp-data.volume:/data:Z

   [Service]
   Restart=always

   [Install]
   WantedBy=default.target
   ```

3. **`<name>.volume`** - Volume definition (if needed):
   ```ini
   [Unit]
   Description=My App Data

   [Volume]

   [Install]
   WantedBy=default.target
   ```

4. **`<name>.network`** - Network definition (if needed):
   ```ini
   [Unit]
   Description=My App Network

   [Network]

   [Install]
   WantedBy=default.target
   ```

## Testing Locally

Before deploying:

```bash
# Validate syntax
leger validate ./my-quadlet

# Dry run
leger deploy install myapp --source ./my-quadlet --dry-run

# Install locally
leger deploy install myapp --source ./my-quadlet

# Check status
leger status myapp

# View logs
leger service logs myapp

# Remove when done
leger deploy remove myapp
```

## More Examples Coming Soon

- WordPress with MySQL
- PostgreSQL database
- Redis cache
- Multi-container applications
- Applications with secrets

## Contributing Examples

To contribute an example:

1. Create a new directory under `examples/`
2. Add all required files (`.leger.yaml`, `.container`, etc.)
3. Test the example locally
4. Submit a pull request

## See Also

- [User Guide](../docs/user-guide.md)
- [Command Reference](../docs/commands.md)
- [Quadlet Documentation](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
