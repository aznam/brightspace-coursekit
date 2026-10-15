<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">

    <xsl:output method="xml" omit-xml-declaration="yes"/>
    
    <xsl:template match="/">
        <h3 class="ck-heading">
            <ck-children/>
        </h3>
    </xsl:template>
    
</xsl:stylesheet>