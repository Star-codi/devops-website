# 🔨 Maven — Build Tool

> Module 06 — Code & Build


## What Problem Does Maven Solve?

When you write Java code, your computer can't run it directly. You need to: compile it (translate to machine code), download external libraries, run tests, and package everything into a single deployable file. Doing this manually for every developer on a team is chaotic.


> **🏗️ Analogy — Construction Site Manager**
> Building a house requires ordering materials, scheduling workers, following blueprints. Maven is the construction manager for your Java project. You describe what you want to build (in a file called pom.xml ), and Maven handles all the steps: fetching materials (dependencies), building (compilation), testing, and packaging.


## The Maven Build Lifecycle

```pom.xml — project configuration
<project>
  <groupId>com.mycompany</groupId>
  <artifactId>my-web-app</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <!-- External libraries my app needs -->
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <version>3.0.0</version>
    </dependency>
  </dependencies>
</project>
```


## Maven Lifecycle Commands

```terminal — maven commands
# Clean old build files
mvn clean
# Compile source code
mvn compile
# Run tests
mvn test
# Package into JAR/WAR file (most common)
mvn package
BUILD SUCCESS
→ Created: target/my-web-app-1.0.0.jar
# Do all steps in one command
mvn clean install
```


> **✅ Module Summary**
> Maven automates Java project building: compile → test → package pom.xml is Maven's configuration file (your project blueprint) Dependencies are automatically downloaded from Maven Central Output is a JAR/WAR file — ready to deploy on any server
